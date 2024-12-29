from abc import ABC, abstractmethod
from typing import Any

class BaseGenerator(ABC):
    @abstractmethod
    def generate(self) -> Any:
        pass

    @abstractmethod
    def generate_with_modifier(self, modifier: str) -> Any:
        pass 