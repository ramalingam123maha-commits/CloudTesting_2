# Java Addition Program

A simple yet comprehensive Java program demonstrating basic addition operations with multiple features and test cases.

## Files Included

### 1. **Addition.java** (Basic Addition Class)
A simple class with overloaded `add()` methods for integers and doubles.

**Features:**
- `add(int a, int b)` - Adds two integers
- `add(double a, double b)` - Adds two decimal numbers
- Demonstration in `main()` method

**Usage:**
```bash
javac Addition.java
java Addition
```

**Output:**
```
Addition of 10 and 20 is: 30
Addition of 15.5 and 24.3 is: 39.8
```

### 2. **AdditionProgram.java** (Interactive Addition Program)
An interactive menu-driven program that allows users to perform various addition operations.

**Features:**
- Add two integers
- Add two decimal numbers
- Add multiple integers at once
- Interactive menu-based interface
- User-friendly input/output

**Usage:**
```bash
javac AdditionProgram.java
java AdditionProgram
```

**Menu Options:**
```
========== Addition Program ==========
1. Add two integers
2. Add two decimal numbers
3. Add multiple integers
4. Exit
```

**Example Session:**
```
Welcome to the Addition Program!

========== Addition Program ==========
1. Add two integers
2. Add two decimal numbers
3. Add multiple integers
4. Exit
Enter your choice (1-4): 1
Enter first integer: 15
Enter second integer: 25
Result: 15 + 25 = 40
```

### 3. **AdditionTest.java** (Unit Tests)
A test class that validates the addition functionality with multiple test cases.

**Features:**
- Tests for integer addition (positive, negative, zero)
- Tests for decimal addition with tolerance checking
- Automated test reporting with pass/fail status
- Test summary with success rate

**Test Cases Included:**
- `10 + 20 = 30`
- `0 + 0 = 0`
- `-10 + 5 = -5`
- `50 + 50 = 100`
- `-15 + -15 = -30`
- `15.5 + 24.3 = 39.8`
- `1.0 + 0.5 = 1.5`
- `-10.5 + 5.0 = -5.5`

**Usage:**
```bash
javac Addition.java AdditionTest.java
java AdditionTest
```

**Output:**
```
Running Addition Tests...

✓ PASSED: Add 10 + 20 = 30
✓ PASSED: Add 0 + 0 = 0
✓ PASSED: Add -10 + 5 = -5
✓ PASSED: Add 50 + 50 = 100
✓ PASSED: Add -15 + -15 = -30
✓ PASSED: Add 15.5 + 24.3 = 39.8
✓ PASSED: Add 0.0 + 0.0 = 0.0
✓ PASSED: Add 1.0 + 0.5 = 1.5
✓ PASSED: Add -10.5 + 5.0 = -5.5

========== Test Summary ==========
Total Tests: 9
Passed: 9
Failed: 0
Success Rate: 100%
```

## Compilation & Execution

### Prerequisites
- Java Development Kit (JDK) 8 or higher installed
- Command line terminal/console

### Step-by-Step Instructions

1. **Navigate to the project directory:**
   ```bash
   cd path/to/project
   ```

2. **Compile all Java files:**
   ```bash
   javac Addition.java AdditionProgram.java AdditionTest.java
   ```

3. **Run the basic addition program:**
   ```bash
   java Addition
   ```

4. **Run the interactive program:**
   ```bash
   java AdditionProgram
   ```

5. **Run the test suite:**
   ```bash
   java AdditionTest
   ```

## Program Structure

### Class Hierarchy

```
Addition
├── add(int, int): int
├── add(double, double): double
└── main(String[]): void

AdditionProgram
├── addIntegers(int, int): int
├── addDoubles(double, double): double
├── addMultipleIntegers(int...): int
├── displayMenu(): void
└── main(String[]): void

AdditionTest
├── assertEquals(int, int, String): void
├── assertEquals(double, double, double, String): void
└── main(String[]): void
```

## Key Concepts Demonstrated

1. **Method Overloading** - Multiple `add()` methods with different parameter types
2. **Varargs (Variable Arguments)** - `addMultipleIntegers(int... numbers)` for flexible input
3. **Scanner Class** - Interactive user input handling
4. **Switch Statements** - Menu-based control flow
5. **Unit Testing** - Basic test framework implementation
6. **Javadoc Comments** - Professional code documentation

## Best Practices Used

- ✓ Clear method naming conventions
- ✓ Comprehensive Javadoc documentation
- ✓ Input validation and error handling
- ✓ User-friendly output messages
- ✓ Separation of concerns
- ✓ Reusable methods
- ✓ Test-driven approach

## Extending the Program

You can easily extend this program by:

1. **Add subtraction, multiplication, division methods**
   ```java
   public static int subtract(int a, int b) { return a - b; }
   public static int multiply(int a, int b) { return a * b; }
   public static double divide(double a, double b) { return a / b; }
   ```

2. **Create a Calculator superclass**
   ```java
   public abstract class Calculator {
       protected int result;
       public abstract void calculate();
   }
   ```

3. **Add file I/O for saving operations**
   ```java
   // Save calculation history to file
   ```

4. **Implement GUI using Swing/JavaFX**
   ```java
   // Create graphical user interface
   ```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `javac: command not found` | Install Java Development Kit (JDK) |
| `Exception in thread "main": java.lang.NoClassDefFoundError` | Ensure all files are compiled in the same directory |
| `InputMismatchException` | Enter correct data type (integer or decimal number) |

## License

This program is provided as-is for educational purposes.

---

**Created:** 2024
**Language:** Java
**Version:** 1.0
