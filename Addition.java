/**
 * A simple Java program to demonstrate addition of two numbers.
 */
public class Addition {
    
    /**
     * Adds two numbers and returns the result.
     *
     * @param a the first number
     * @param b the second number
     * @return the sum of a and b
     */
    public static int add(int a, int b) {
        return a + b;
    }
    
    /**
     * Adds two double numbers and returns the result.
     *
     * @param a the first number
     * @param b the second number
     * @return the sum of a and b
     */
    public static double add(double a, double b) {
        return a + b;
    }
    
    /**
     * Main method to demonstrate the addition program.
     */
    public static void main(String[] args) {
        // Test addition with integers
        int num1 = 10;
        int num2 = 20;
        int result = add(num1, num2);
        System.out.println("Addition of " + num1 + " and " + num2 + " is: " + result);
        
        // Test addition with doubles
        double num3 = 15.5;
        double num4 = 24.3;
        double result2 = add(num3, num4);
        System.out.println("Addition of " + num3 + " and " + num4 + " is: " + result2);
    }
}
