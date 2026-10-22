import java.util.Scanner;

/**
 * An interactive Java program for performing addition operations.
 * This program allows users to add two numbers interactively.
 */
public class AdditionProgram {
    
    /**
     * Adds two integers.
     *
     * @param a the first integer
     * @param b the second integer
     * @return the sum of a and b
     */
    public static int addIntegers(int a, int b) {
        return a + b;
    }
    
    /**
     * Adds two double numbers.
     *
     * @param a the first double
     * @param b the second double
     * @return the sum of a and b
     */
    public static double addDoubles(double a, double b) {
        return a + b;
    }
    
    /**
     * Adds multiple integers.
     *
     * @param numbers variable number of integers
     * @return the sum of all numbers
     */
    public static int addMultipleIntegers(int... numbers) {
        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        return sum;
    }
    
    /**
     * Displays the menu options.
     */
    private static void displayMenu() {
        System.out.println("\n========== Addition Program ==========");
        System.out.println("1. Add two integers");
        System.out.println("2. Add two decimal numbers");
        System.out.println("3. Add multiple integers");
        System.out.println("4. Exit");
        System.out.print("Enter your choice (1-4): ");
    }
    
    /**
     * Main method to run the interactive addition program.
     */
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int choice;
        
        System.out.println("Welcome to the Addition Program!");
        
        while (true) {
            displayMenu();
            choice = scanner.nextInt();
            
            switch (choice) {
                case 1:
                    System.out.print("Enter first integer: ");
                    int int1 = scanner.nextInt();
                    System.out.print("Enter second integer: ");
                    int int2 = scanner.nextInt();
                    int resultInt = addIntegers(int1, int2);
                    System.out.println("Result: " + int1 + " + " + int2 + " = " + resultInt);
                    break;
                    
                case 2:
                    System.out.print("Enter first decimal number: ");
                    double dbl1 = scanner.nextDouble();
                    System.out.print("Enter second decimal number: ");
                    double dbl2 = scanner.nextDouble();
                    double resultDouble = addDoubles(dbl1, dbl2);
                    System.out.println("Result: " + dbl1 + " + " + dbl2 + " = " + resultDouble);
                    break;
                    
                case 3:
                    System.out.print("How many integers do you want to add? ");
                    int count = scanner.nextInt();
                    int[] numbers = new int[count];
                    for (int i = 0; i < count; i++) {
                        System.out.print("Enter integer " + (i + 1) + ": ");
                        numbers[i] = scanner.nextInt();
                    }
                    int resultMultiple = addMultipleIntegers(numbers);
                    System.out.print("Result: ");
                    for (int i = 0; i < numbers.length; i++) {
                        System.out.print(numbers[i]);
                        if (i < numbers.length - 1) {
                            System.out.print(" + ");
                        }
                    }
                    System.out.println(" = " + resultMultiple);
                    break;
                    
                case 4:
                    System.out.println("Thank you for using the Addition Program. Goodbye!");
                    scanner.close();
                    return;
                    
                default:
                    System.out.println("Invalid choice. Please enter a number between 1 and 4.");
            }
        }
    }
}
