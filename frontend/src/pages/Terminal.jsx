import { ReactTerminal } from "react-terminal";
import { useSelector } from "react-redux";

function Terminal() {
    const { user } = useSelector((state) => state.profile);
  // Define commands here
  const commands = {
    whoami: `${user.FULLNAME}`,

    cd: (directory) => `changed path to ${directory}`,

    contact: "If you need help, you can contact Iftee at iftekharulislam1594@gmail.com`",

    ls: "bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var",

    pwd: `/home/${user.FULLNAME}`,

    echo: (text) => text,

    date: new Date().toString(),

    uname: "Linux@CyberCafe",

    mkdir: (dirname) => `Directory ${dirname} created`,

    rmdir: (dirname) => `Directory ${dirname} removed`,

    touch: (filename) => `File ${filename} created`,

    rm: (filename) => `File ${filename} deleted`,

    cat: (filename) => `Displaying contents of ${filename}...`,

    history: "No commands in history.",

    clear: () => {
      document.querySelectorAll(".terminal-body")[0].innerHTML = "";
      return "";
    },

    sudo: "Error: Permission denied",

    ifconfig: `eth0      Link encap:Ethernet  HWaddr 00:0c:29:68:22:0b  
              inet addr:192.168.1.105  Bcast:192.168.1.255  Mask:255.255.255.0`,

    ping: (address) => `PING ${address}: 56 data bytes`,

    nmap: (target) => `Starting Nmap 7.80 ( https://nmap.org ) at 2024-09-30
            Nmap scan report for ${target} (192.168.1.1)
            Host is up (0.00013s latency).
            Not shown: 998 closed ports
            PORT    STATE SERVICE
            22/tcp  open  ssh
            80/tcp  open  http`,

    netstat: `Active Internet connections (servers and established)
    Proto Recv-Q Send-Q Local Address           Foreign Address         State      
    tcp        0      0 localhost:5173          0.0.0.0:*               LISTEN     
    tcp        0      0 192.168.1.105:ssh       0.0.0.0:*               LISTEN     
    udp        0      0 localhost:5000          0.0.0.0:*`,

    msfconsole: "Metasploit Framework Console - Launching...",

    hydra: "Hydra v9.1 (c) 2023 by van Hauser/THC & David Maciejak - starting at 2024-09-30",

    aircrack: "Aircrack-ng 1.6: cracking WEP and WPA keys",

    help: `
        Available commands:
        whoami - Displays the current user
        cd <directory> - Changes the directory
        ls - Lists directory contents
        pwd - Prints the current working directory
        echo <text> - Displays the text
        date - Displays the current date and time
        uname - Displays the operating system name
        mkdir <directory> - Creates a new directory
        rmdir <directory> - Removes an empty directory
        touch <filename> - Creates an empty file
        rm <filename> - Deletes a file
        cat <filename> - Displays the contents of a file
        history - Displays the command history
        sudo - Simulates sudo permissions error
        ifconfig - Displays network configuration
        ping <address> - Sends ICMP request to the address
        nmap <target> - Scans the target IP for open ports
        netstat - Displays network statistics
        msfconsole - Launches the Metasploit console (simulated)
        hydra - Launches Hydra password cracker (simulated)
        aircrack - Launches Aircrack for WiFi password cracking (simulated)
        clear - Clears the terminal
        help - Displays this help message
        If you need further assistance, you can contact Iftee at iftekharulislam1594@gmail.com
    `
  };

  return (
    <div className="min-h-screen w-auto mx-20 mt-20 ">
      <p className="text-caribbeangreen-500 font-mono mb-4">
        This terminal emulator will help you become comfortable with terminals and basic commands, including common hacking tools.
      </p>
      <ReactTerminal
      commands={commands}
      prompt="  @react-terminal:~$"
      errorMessage="Command not found!"
      showControlBar={true}
      showControlButtons={true}
      theme="my-custom-theme"
      themes={{
        "my-custom-theme": {
          themeBGColor: "#1d1f21",
          themeToolbarColor: "#4d4d4d",
          themeColor: "#c5c8c6",
          themePromptColor: "#b294bb",
        },
      }}
    />
    </div>
  );
}

export default Terminal;
