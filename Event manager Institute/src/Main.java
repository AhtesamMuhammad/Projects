import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

public class Main {

    // Declare and initialize variables and data structures
    public static ArrayList<Participant> participants = new ArrayList<>();
    public static File dataFile = new File("volunteersData.txt");
    public static Scanner sc = new Scanner(System.in);
    public static Scanner fsc;
    public static double totalDonatedMoney = 0;
    public static int minAge = Integer.MAX_VALUE;
    public static int maxAge = 0;

    // Static block for initializing the 'fsc' Scanner
    static {
        try {
            fsc = new Scanner(dataFile);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    // Main entry point of the program
    public static void main(String[] args) {
        // Load and process data, assign roles, and display the main menu
        scanData();
        analyseData();
        assignRoles();
        menu();
    }

    // Display the main menu and handle user input
    public static void menu() {
        System.out.println("What would you like to do: \n 1. See volunteers' data \n 2. Add an event \n 3. Watch finances \n 0. Exit ");
        int input = sc.nextInt();

        switch (input) {
            case 1 -> {
                printData();
                line();
                menu();
            }
            case 2 -> {
                // Create a new event, print attendance list if desired, and return to the main menu
                Event newEvent = new Event();
                line();
                System.out.println("Do you want to print the list of allowed participants? [Y/n]");
                if (readBooleanInput()) {
                    newEvent.printAttendanceList();
                }
                line();
                menu();
            }
            case 3 -> {
                // Display financial information and return to the main menu
                printFinance();
                line();
                menu();
            }
            case 0 -> {
                System.out.println("Thanks for using this program <3");
                line();
            }
            default -> {
                System.out.println("Please enter a valid choice.");
                menu();
            }
        }
    }

    // Read and validate a boolean input ('Y' or 'N')
    public static boolean readBooleanInput() {
        String input = sc.next().toUpperCase();

        if (input.charAt(0) == 'Y') {
            return true;
        } else if (input.charAt(0) == 'N') {
            return false;
        } else {
            System.out.println("Enter a valid choice");
            return readBooleanInput();
        }
    }

    // Print a horizontal line for formatting purposes
    public static void line() {
        for (int i = 0; i < 130; i++) {
            System.out.print("-");
        }
        System.out.println();
    }

    // Read and process data from a file and populate the 'participants' list
    public static void scanData() {
        while (fsc.hasNextLine()) {
            // Create Participant objects and populate their data
            Participant participant = new Participant();
            participants.add(participant);

            String[] participantData = fsc.nextLine().split(" ", 8);

            String fullName = participantData[0] + " " + participantData[1];
            participant.setFullName(fullName);

            int age = Integer.parseInt(participantData[2]);
            participant.setAge(age);

            String department = participantData[3] + " " + participantData[4] + " " + participantData[5];
            participant.setDepartment(department);

            String year = participantData[6];
            participant.setYear(year);

            int donatedMoney = Integer.parseInt(participantData[7]);
            participant.setDonatedMoney(donatedMoney);

        }
    }

    // Analyze participant data to calculate statistics
    public static void analyseData() {
        for (Participant part : participants) {
            totalDonatedMoney += part.getDonatedMoney();

            if (part.getAge() < minAge) minAge = part.getAge();
            if (part.getAge() > maxAge) maxAge = part.getAge();

            part.setAdult(part.getAge() >= 18);
        }
    }

    // Assign roles to participants based on age
    public static void assignRoles() {
        for (Participant part : participants) {
            if (part.getAge() == minAge) part.setTitle("secretary");
            else if (part.getAge() == maxAge) part.setTitle("president");
            else part.setTitle("normal volunteer");
        }
    }

    // Print the list of participants and their data
    public static void printData() {
        System.out.println("List of Allowed Volunteers:");
        System.out.printf("%-12s %-30s %-10s %-30s %-10s %-20s\n", "ID", "Full Name", "Age", "Department", "Year", "Title");
        line();

        for (Participant part : participants) {
            System.out.println(Participant.toString(part));
        }
    }

    // Print financial information, including donations and balance
    public static void printFinance() {
        for (Participant part : participants) {
            System.out.print(part.getFullName() + " - ");
            System.out.println(part.getDonatedMoney() + " €");
        }
        System.out.print("\n");
        System.out.println("Balance: " + totalDonatedMoney + " €");
    }
}
