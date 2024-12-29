import random
import string
from .base import BaseGenerator
from ..utils.modifiers import parse_string_modifier

class StringGenerator(BaseGenerator):
    def generate(self, length: int = 10) -> str:
        return ''.join(random.choices(string.ascii_uppercase, k=1) + 
                      random.choices(string.ascii_lowercase, k=length-1))

    def generate_with_modifier(self, modifier: str) -> str:
        params = parse_string_modifier(modifier)
        if params['pattern']:
            # TODO: Implement regex pattern generator
            return self.generate(params['maxLength'])
        length = random.randint(params['minLength'], params['maxLength'])
        return self.generate(length)

    def generate_email(self) -> str:
        first = self.generate(6)
        last = self.generate(8)
        return f"{first}.{last}@example.com".lower()

    def generate_phone(self) -> str:
        return f"+1-{random.randint(100,999)}-{random.randint(100,999)}-{random.randint(1000,9999)}" 