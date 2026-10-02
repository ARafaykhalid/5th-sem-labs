def calculate_average(scores): 
    """Return the average of a list of numeric scores.""" 
    return sum(scores) / len(scores) 

def print_report(scores): 
    """Print a short summary for a list of scores.""" 
    print("Average:", calculate_average(scores)) 

if __name__ == "__main__": 
    student_scores = [78, 92, 55, 88] 
    print_report(student_scores) 
