import { exec } from "child_process";
const consoleErrorBeep = () => {
    exec("1..3 | %{ [console]::beep(1000, 500) }", {
        shell: "powershell.exe",
    });
};
export default consoleErrorBeep;
//# sourceMappingURL=ConsoleErrorBeep.js.map