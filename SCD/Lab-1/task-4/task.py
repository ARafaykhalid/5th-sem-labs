# Functions for basic arithmetic operations
def add_numbers(a, b):
    return a + b

def subtract_numbers(a, b):
    return a - b

def multiply_numbers(a, b):
    return a * b

def divide_numbers(a, b):
    return a / b

# Ask the user for two numbers
num1 = float(input("Enter the first number: "))
num2 = float(input("Enter the second number: "))

# Display the results
print("Addition:", add_numbers(num1, num2))
print("Subtraction:", subtract_numbers(num1, num2))
print("Multiplication:", multiply_numbers(num1, num2))
print("Division:", divide_numbers(num1, num2))
