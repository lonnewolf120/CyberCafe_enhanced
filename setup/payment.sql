create or replace type mcsc.course_array as
	varray(100) of number;
/

create or replace procedure create_payment (
	p_userid  in mcsc.account.user_id%type,
	p_amount  in number,
	p_date    in varchar2,
	p_courses in course_array,  -- Array of course names or IDs
	p_message out varchar2,
	p_trxid   out varchar2
) is
	l_balance    number;
	l_account_id mcsc.account.account_id%type;
begin
    -- Fetch account data
	begin
		select balance,
		       account_id
		  into
			l_balance,
			l_account_id
		  from mcsc.account
		 where user_id = p_userid;
	exception
		when no_data_found then
            -- Create account if not exists
			insert into mcsc.account (
				user_id,
				balance
			) values ( p_userid,
			           100 );
			commit;
            -- Fetch the newly created account data
			select balance,
			       account_id
			  into
				l_balance,
				l_account_id
			  from mcsc.account
			 where user_id = p_userid;
	end;

    -- Check balance
	if l_balance < p_amount then
		p_message := 'Insufficient Balance, current balance: ' || l_balance;
		return;
	end if;

    -- Deduct balance
	update mcsc.account
	   set
		balance = balance - p_amount
	 where user_id = p_userid;
	commit;

    -- Generate a smaller TRXID (format: USERID_ACCOUNTID_YYYYMMDD)
	p_trxid   := to_char(p_userid)
	           || '_'
	           || to_char(l_account_id)
	           || '_'
	           || replace(
	                     substr(
	                           p_date,
	                           1,
	                           10
	                     ),
	                     '-',
	                     ''
	              );

    -- Insert into TRX_HISTORY
	insert into mcsc.trx_history (
		trxid,
		user_id,
		account_id,
		date_of_trx,
		amount_of_trx
	) values ( p_trxid,
	           p_userid,
	           l_account_id,
	           to_timestamp(p_date,
	                        'YYYY-MM-DD HH24:MI:SS'),
	           p_amount );
	commit;

    -- Insert each course from the array into a related table or process them as needed
	for i in 1..p_courses.count loop
		insert into mcsc.course_bought (
			trxid,
			user_id,
			course_id,
			purchase_date
		) values ( p_trxid,
		           p_userid,
		           p_courses(i),
		           to_timestamp(p_date,
		                        'YYYY-MM-DD HH24:MI:SS') );
	end loop;
	commit;
	p_message := 'Transaction successful';
exception
	when others then
		p_message := 'Transaction failed: ' || sqlerrm;
		rollback;
end;
/



begin
	create_payment(
        p_userid => :user_id,
        p_amount => :amount,
        p_date => :date,
        p_courses => :courses,
        p_message => :message,
        p_trxid => :trxid
	);
end;