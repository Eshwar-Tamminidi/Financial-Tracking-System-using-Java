import java.util.ArrayList;
import java.util.Scanner;

class Transaction {
    String type;
    String description;
    double amount;

    public Transaction(String type, String description, double amount) {
        this.type = type;
        this.description = description;
        this.amount = amount;
    }

    @Override
    public String toString() {
        return type.toUpperCase() + ": " + description + " - $" + amount;
    }
}

public class Main {
    private double balance;
    private final ArrayList<Transaction> transactions;
    private final Scanner scanner;

    public Main() {
        balance = 0.0;
        transactions = new ArrayList<>();
        scanner = new Scanner(System.in);
    }

    public void start() {
        while (true) {
            printMenu();
            int choice = scanner.nextInt();
            scanner.nextLine();  // consume newline
            switch (choice) {
                case 1 -> addIncome();
                case 2 -> addExpense();
                case 3 -> showTransactions();
                case 4 -> showBalance();
                case 5 -> {
                    System.out.println("Exiting... Goodbye!");
                    return;
                }
                default -> System.out.println("Invalid option. Try again.");
            }
        }
    }

    private void printMenu() {
        System.out.println("\n--- Finance Tracker Menu ---");
        System.out.println("1. Add Income");
        System.out.println("2. Add Expense");
        System.out.println("3. View Transactions");
        System.out.println("4. View Balance");
        System.out.println("5. Exit");
        System.out.print("Choose an option: ");
    }

    private void addIncome() {
        System.out.print("Enter description: ");
        String desc = scanner.nextLine();
        System.out.print("Enter amount: ");
        double amount = scanner.nextDouble();
        balance += amount;
        transactions.add(new Transaction("income", desc, amount));
        System.out.println("Income added.");
    }

    private void addExpense() {
        System.out.print("Enter description: ");
        String desc = scanner.nextLine();
        System.out.print("Enter amount: ");
        double amount = scanner.nextDouble();
        balance -= amount;
        transactions.add(new Transaction("expense", desc, amount));
        System.out.println("Expense added.");
    }

    private void showTransactions() {
        if (transactions.isEmpty()) {
            System.out.println("No transactions recorded.");
        } else {
            System.out.println("\n--- Transaction History ---");
            for (Transaction t : transactions) {
                System.out.println(t);
            }
        }
    }

    private void showBalance() {
        System.out.printf("Current Balance: $%.2f%n", balance);
    }

    public static void main(String[] args) {
        Main app = new Main();
        app.start();
    }
}
