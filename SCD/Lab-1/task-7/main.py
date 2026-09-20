from calculator import add_numbers, subtract_numbers, multiply_numbers, divide_numbers

num1 = float(input("Enter the first number: "))
num2 = float(input("Enter the second number: "))

print("Addition:", add_numbers(num1, num2))
print("Subtraction:", subtract_numbers(num1, num2))
print("Multiplication:", multiply_numbers(num1, num2))

if num2 != 0:
    print("Division:", divide_numbers(num1, num2))
else:
    print("Division: Cannot divide by zero.")
