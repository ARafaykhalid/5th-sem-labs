total = 0


def add_item(price):
    global total
    total += price
    return total


print(add_item(10))  # Output: None
