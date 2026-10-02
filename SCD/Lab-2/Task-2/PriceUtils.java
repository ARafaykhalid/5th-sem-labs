public class PriceUtils { 
    /** 
     * Returns the sum of a list of item prices. 
     * 
     * @param prices the item prices 
     * @return the total of all prices 
     */ 
    public static double total(double[] prices) { 
        double sum = 0; 
        for (double price : prices) { 
            sum += price; // accumulate running total 
        } 
        return sum; 
    } 

    /** 
     * Returns the average of a list of item prices. 
     * 
     * @param prices the item prices 
     * @return the mean price 
     */ 
    public static double average(double[] prices) { 
        return total(prices) / prices.length; 
    } 
} 
