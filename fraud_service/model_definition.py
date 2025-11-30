import torch.nn as nn

class Model(nn.Module):
    def __init__(self, input_size=14):
        super(Model, self).__init__()
        self.l1 = nn.Linear(input_size, 10)
        self.l2 = nn.Linear(10, 1)
        self.out = nn.Sigmoid()

    def forward(self, x):
        x = self.l1(x)
        x = self.l2(x)
        x = self.out(x)
        return x
