import java.util.ArrayList;

public class Event {
    public String eventName;
    public int minAttendance;
    public int maxAttendance;
    public boolean ageRestriction;
    String departments_allowed;
    public int attendance = 0;

    public Event() {
        System.out.print("What's the name of the event? ");
        eventName = Main.sc.nextLine();
        eventName = Main.sc.nextLine();

        System.out.print("What is the maximum attendance? ");
        maxAttendance = Integer.parseInt(Main.sc.nextLine());

        System.out.print("What is the minimum attendance? ");
        minAttendance = Integer.parseInt(Main.sc.nextLine());

        System.out.println("Are minors accepted? [Y/N] ");
        ageRestriction = Main.readBooleanInput();

        System.out.println("What departments are allowed to attend the event? (You can choose more than one)");
        System.out.println("C: COMPUTING AND COMMUNICATIONS");
        System.out.println("T: TRADE AND MARKETING");
        System.out.println("A: ADMINISTRATION AND MANAGEMENT");
        departments_allowed = Main.sc.next().toUpperCase();

        // Print attendance list
        printAttendanceList();
    }

    // Check if a participant is allowed to attend the event
    public boolean isAllowed(Participant p) {
        boolean output = true;
        if (!p.isAdult() && ageRestriction)
            output = false;
        else if (departments_allowed.indexOf(p.getDepartmentCode()) == -1)
            output = false;

        return output;
    }

    // Check the event's capacity
    public void checkCapacity() {
        if (attendance < minAttendance) {
            System.out.println("The attendance is not enough to organize this event.");
        } else if (attendance > maxAttendance) {
            System.out.println("The attendance will be higher than the capacity of this event.");
        } else {
            System.out.println("The attendance is suitable to organize this event.");
        }
    }

    // Create a list of participants allowed to attend the event
    public ArrayList<Participant> attendanceList() {
        ArrayList<Participant> allowedParticipants = new ArrayList<>();
        for (int i = 0; i < Main.participants.size(); i++) {
            Participant part = Main.participants.get(i);
            if (isAllowed(part)) {
                allowedParticipants.add(part);
            }
        }
        attendance = allowedParticipants.size();
        return allowedParticipants;
    }

    // Print the list of allowed participants
    public void printAttendanceList() {
        System.out.println("List of Allowed Volunteers:");
        System.out.printf("%-12s %-30s %-10s %-30s %-10s %-20s\n", "ID", "Full Name", "Age", "Department", "Year", "Title");
        Main.line();

        ArrayList<Participant> allowedParticipants = attendanceList();

        for (int i = 0; i < attendance; i++) {
            System.out.println(Participant.toString(allowedParticipants.get(i)));
        }
    }
}
