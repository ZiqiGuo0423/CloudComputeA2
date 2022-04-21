from scipy.optimize import fsolve
from math import sin,cos

def f(x):
    x0 = float(x[0])
    x1 = float(x[1])
    x2 = float(x[2])
    return [
        x0+x1-401-0.008*(x1-100)*(x1-100),
        0.002*x0+7-x2,
        0.002*x1+7-x2*(2.16-0.016*x1)
    ]

result = fsolve(f, [1244.23,-843.23,9.49])

print (result)
print (f(result))
# pg1 = 380
# pg2 = 800
# pg3 = 820
# result = 300 + 8*pg1 + 0.0015*pg1*pg1 + 450 + 8*pg2 + 0.0005*pg2*pg2 + 700 + 7.5*pg3 + 0.001*pg3*pg3
# print(result)


