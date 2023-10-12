public class Participant {

    // Properties of the Participant class
    public int id;
    private String fullName;
    private int age;
    private boolean isAdult;
    private String departement;
    private String title;
    private String year;
    private double donatedMoney;

    // Constructor to initialize id (not used)
    public Participant() {
        int id = this.id; // This line doesn't seem to have a meaningful purpose
    }

    // Get the department code (C, T, or A) based on the department name
    public char getDepartmentCode() {
        if (departement.equals("COMPUTING AND COMMUNICATIONS")) return 'C';
        else if (departement.equals("TRADE AND MARKETING")) return 'T';
        else return 'A';
    }

    // Static method to format Participant data as a string
    public static String toString(Participant part) {
        return String.format("%-12s %-30s %-10s %-30s %-10s %-20s",
                part.getId(), part.getFullName(), part.getAge(), part.getDepartement(), part.getYear(), part.getTitle());
    }

    // Getter methods for various properties
    public int getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public int getAge() {
        return age;
    }

    public boolean isAdult() {
        return isAdult;
    }

    public String getDepartement() {
        return departement;
    }

    public String getTitle() {
        return title;
    }

    public String getYear() {
        return year;
    }

    public double getDonatedMoney() {
        return donatedMoney;
    }

    // Setter methods for various properties
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void setAdult(boolean adult) {
        isAdult = adult;
    }

    public void setDepartment(String departement) {
        this.departement = departement;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public void setDonatedMoney(double donatedMoney) {
        this.donatedMoney = donatedMoney;
    }
}
