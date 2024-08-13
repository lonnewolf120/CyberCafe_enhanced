DECLARE
    p_course_id NUMBER := :COURSE_ID;
    -- SECTION
    v_section_id MCSC.SECTION.SECTION_ID%TYPE;
    v_section_name MCSC.SECTION.SECTION_NAME%TYPE;
    v_subsection_id MCSC.SECTION.SUBSECTION_ID%TYPE;
    v_course_id MCSC.SECTION.COURSE_ID%TYPE;

    -- SUBSECTION  
    v_title MCSC.SUBSECTION.TITLE%TYPE;
    V_TIME MCSC.SUBSECTION.TIME_DURATION%TYPE;
    V_DESC MCSC.SUBSECTION.DESCRIPTION%TYPE;
    V_VIDEO MCSC.SUBSECTION.VIDEO_URL%TYPE;

    -- Cursor to fetch sections
    CURSOR section_cursor IS
        SELECT SECTION_ID, SECTION_NAME, COURSE_ID, SUBSECTION_ID
        FROM MCSC.SECTION
        WHERE COURSE_ID = p_course_id;

    -- Cursor to fetch subsections for a specific section
    CURSOR subsection_cursor IS
        SELECT SUBSECTION_ID, TITLE, TIME_DURATION, DESCRIPTION, VIDEO_URL
        FROM MCSC.SUBSECTION
        WHERE SECTION_ID = v_section_id
        AND COURSE_ID = p_course_id;

BEGIN
    -- Loop through each section
    OPEN section_cursor;
    LOOP
        FETCH section_cursor INTO v_section_id, v_section_name, v_course_id, v_subsection_id;
        EXIT WHEN section_cursor%NOTFOUND;

        -- Output section details
        DBMS_OUTPUT.PUT_LINE('Section ID: ' || v_section_id || ' | Section Name: ' || v_section_name);

        -- Loop through each subsection within the section
        OPEN subsection_cursor;
        LOOP
            FETCH subsection_cursor INTO v_subsection_id, v_title, V_TIME, V_DESC, V_VIDEO;
            EXIT WHEN subsection_cursor%NOTFOUND;

            -- Output subsection details
            DBMS_OUTPUT.PUT_LINE('  Subsection ID: ' || v_subsection_id || ' | Subsection Name: ' || v_title || ' | Time Duration: ' || V_TIME || ' | Description: ' || V_DESC || ' | Video URL: ' || V_VIDEO);
        END LOOP;
        CLOSE subsection_cursor;

    END LOOP;
    CLOSE section_cursor;

END;