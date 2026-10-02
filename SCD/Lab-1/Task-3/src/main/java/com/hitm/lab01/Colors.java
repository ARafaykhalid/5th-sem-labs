package com.hitms.lab01;
import org.fusesource.jansi.AnsiConsole;
import static org.fusesource.jansi.Ansi.ansi;
import static org.fusesource.jansi.Ansi.Color.GREEN;

public class Colors {
    public static void main(String[] args) {
        AnsiConsole.systemInstall();
        System.out.println(ansi().fg(GREEN).a("Hello, Software Construction! My name is Abdul Rafay Khalid").reset());
        AnsiConsole.systemUninstall();
    } 
} 
 