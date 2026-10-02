marks = float(input("Enter your marks: "))

# Check pass or fail
if marks >= 50:
    print("Result: Pass")
else:
    print("Result: Fail")

# Display grade
if marks >= 80:
    print("Grade: A")
elif marks >= 70:
    print("Grade: B")
elif marks >= 60:
    print("Grade: C")
elif marks >= 50:
    print("Grade: D")
else:
    print("Grade: F")
