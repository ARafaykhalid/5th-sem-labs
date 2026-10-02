def total(prices):
    """Return the sum of a list of item prices."""
    return sum(prices)


def average(prices):
    """Return the average of a list of item prices."""
    # Reuse total() instead of summing again
    return total(prices) / len(prices)


print(total([10, 20, 30]))
