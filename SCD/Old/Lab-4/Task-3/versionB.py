def add_item(cart, price):
    cart.append(price)
    return cart


def calculate_total(cart):
    return sum(cart)


print(calculate_total([10, 20, 30]))  # Output: 60
