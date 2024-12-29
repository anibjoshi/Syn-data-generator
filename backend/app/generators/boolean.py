import random
from .base import BaseGenerator
from ..utils.modifiers import parse_boolean_modifier

class BooleanGenerator(BaseGenerator):
    def generate(self) -> bool:
        return random.choice([True, False])

    def generate_with_modifier(self, modifier: str) -> bool:
        prob = parse_boolean_modifier(modifier)
        return random.random() < prob 