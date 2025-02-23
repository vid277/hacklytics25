def linear_regression(x, y):
    n = len(x)
    # Calculate means
    x_mean = sum(x) / n
    y_mean = sum(y) / n
    
    # Calculate slope (w1)
    numerator = sum((x[i] - x_mean) * (y[i] - y_mean) for i in range(n))
    denominator = sum((x[i] - x_mean) ** 2 for i in range(n))
    w1 = numerator / denominator
    
    # Calculate intercept (w0)
    w0 = y_mean - w1 * x_mean
    
    return w0, w1

def main():
    # Read data from CSV
    x_values = []
    y_values = []
    
    with open('data.csv', 'r') as file:
        # Skip header row
        next(file)
        for line in file:
            # Split by comma and convert to float
            values = line.strip().split(',')
            x_values.append(float(values[0]))
            y_values.append(float(values[1]))
    
    # Perform linear regression
    w0, w1 = linear_regression(x_values, y_values)
    
    # Create outputs directory if it doesn't exist
    import os
    os.makedirs('outputs', exist_ok=True)
    
    # Save weights to file
    with open('outputs/model.txt', 'w') as file:
        file.write(f'Intercept (w0): {w0}\n')
        file.write(f'Slope (w1): {w1}\n')
        
if __name__ == '__main__':
    main()