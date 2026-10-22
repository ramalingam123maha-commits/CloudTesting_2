/**
 * Unit tests for the Addition program.
 * This class contains test cases for the addition functionality.
 */
public class AdditionTest {
    
    private static int passedTests = 0;
    private static int totalTests = 0;
    
    /**
     * Asserts that two values are equal.
     *
     * @param expected the expected value
     * @param actual the actual value
     * @param testName the name of the test
     */
    private static void assertEquals(int expected, int actual, String testName) {
        totalTests++;
        if (expected == actual) {
            System.out.println("✓ PASSED: " + testName);
            passedTests++;
        } else {
            System.out.println("✗ FAILED: " + testName + " (expected: " + expected + ", got: " + actual + ")");
        }
    }
    
    /**
     * Asserts that two double values are equal (with tolerance).
     *
     * @param expected the expected value
     * @param actual the actual value
     * @param delta the tolerance
     * @param testName the name of the test
     */
    private static void assertEquals(double expected, double actual, double delta, String testName) {
        totalTests++;
        if (Math.abs(expected - actual) < delta) {
            System.out.println("✓ PASSED: " + testName);
            passedTests++;
        } else {
            System.out.println("✗ FAILED: " + testName + " (expected: " + expected + ", got: " + actual + ")");
        }
    }
    
    /**
     * Runs all test cases.
     */
    public static void main(String[] args) {
        System.out.println("Running Addition Tests...\n");
        
        // Test addIntegers method
        assertEquals(30, Addition.add(10, 20), "Add 10 + 20 = 30");
        assertEquals(0, Addition.add(0, 0), "Add 0 + 0 = 0");
        assertEquals(-5, Addition.add(-10, 5), "Add -10 + 5 = -5");
        assertEquals(100, Addition.add(50, 50), "Add 50 + 50 = 100");
        assertEquals(-30, Addition.add(-15, -15), "Add -15 + -15 = -30");
        
        // Test addDoubles method
        assertEquals(39.8, Addition.add(15.5, 24.3), 0.01, "Add 15.5 + 24.3 = 39.8");
        assertEquals(0.0, Addition.add(0.0, 0.0), 0.01, "Add 0.0 + 0.0 = 0.0");
        assertEquals(1.5, Addition.add(1.0, 0.5), 0.01, "Add 1.0 + 0.5 = 1.5");
        assertEquals(-5.5, Addition.add(-10.5, 5.0), 0.01, "Add -10.5 + 5.0 = -5.5");
        
        // Print summary
        System.out.println("\n========== Test Summary ==========");
        System.out.println("Total Tests: " + totalTests);
        System.out.println("Passed: " + passedTests);
        System.out.println("Failed: " + (totalTests - passedTests));
        System.out.println("Success Rate: " + (100 * passedTests / totalTests) + "%");
    }
}
