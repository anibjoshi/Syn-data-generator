from faker import Faker

class FakerService:
    def __init__(self):
        self.fake = Faker()
        self.mappings = {
            'first_name': self.fake.first_name,
            'last_name': self.fake.last_name,
            'email': self.fake.email,
            'phone': self.fake.phone_number,
            'address': self.fake.address,
            'city': self.fake.city,
            'country': self.fake.country,
            'company': self.fake.company
        }

    def get_faker_function(self, column_name: str):
        """Get appropriate faker function for column name"""
        return next(
            (self.mappings[k] for k in self.mappings.keys() 
             if k in column_name.lower()),
            None
        )

    def get_mapping_keys(self):
        """Get list of all faker mapping keys"""
        return list(self.mappings.keys()) 