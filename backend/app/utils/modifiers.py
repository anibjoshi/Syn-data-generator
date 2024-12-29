from datetime import datetime

def parse_numeric_modifier(modifier: str) -> dict:
    try:
        parts = modifier.split(',')
        result = {
            'min': float(parts[0]) if parts[0].strip() else 1,
            'max': float(parts[1]) if parts[1].strip() else 1000000,
            'precision': int(parts[2]) if len(parts) > 2 and parts[2].strip() else 0,
            'distribution': parts[3].strip() if len(parts) > 3 else 'uniform'
        }
        return result
    except Exception:
        return {'min': 1, 'max': 1000000, 'precision': 0, 'distribution': 'uniform'}

def parse_string_modifier(modifier: str) -> dict:
    try:
        parts = modifier.split(',')
        pattern = None
        for part in parts:
            if 'pattern:' in part:
                pattern = part.split('pattern:')[1].strip().strip("'").strip('"')
        
        result = {
            'minLength': int(parts[0]) if parts[0].strip() else 1,
            'maxLength': int(parts[1]) if parts[1].strip() else 10,
            'pattern': pattern
        }
        return result
    except Exception:
        return {'minLength': 1, 'maxLength': 10, 'pattern': None}

def parse_datetime_modifier(modifier: str) -> dict:
    try:
        parts = modifier.split(',')
        format_str = None
        for part in parts:
            if 'format:' in part:
                format_str = part.split('format:')[1].strip().strip("'").strip('"')
        
        result = {
            'start': datetime.strptime(parts[0].strip(), '%Y-%m-%d') if parts[0].strip() else datetime(2020, 1, 1),
            'end': datetime.strptime(parts[1].strip(), '%Y-%m-%d') if parts[1].strip() else datetime.now(),
            'format': format_str or '%Y-%m-%d'
        }
        return result
    except Exception:
        return {'start': datetime(2020, 1, 1), 'end': datetime.now(), 'format': '%Y-%m-%d'}

def parse_boolean_modifier(modifier: str) -> float:
    try:
        return float(modifier)
    except Exception:
        return 0.5 