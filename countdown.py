import time
my_time = int(input("Enter time in second"))
for i in range(my_time, 0, -1):
    Second = i % 60
    minutes =int(i / 60) % 60
    hours = int(i / 3600)

    print(f"{hours:02}:{minutes:02}:{Second:02}")
    time.sleep(1)