# jsonを小さくする
import json


class DataJson:
    def __init__(self):
        self.json_file = '../data/data.json'

    def get_data(self):
        json_open = open(self.json_file)
        json_load = json.load(json_open)
        for key in json_load['features']:
            del key['properties']['icon'], key['properties']['munic'], key['properties']['url'], key['properties']['industry']

        json.dumps(json_load)
        with open('../data/data.json', 'w') as f:
            json.dump(json_load, f, indent=4,
                      ensure_ascii=False, separators=(',', ': '))


if __name__ == "__main__":
    data = DataJson().get_data()
