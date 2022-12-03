# ./tool/del_csvの中に大阪府から来た削除対象のExcelのセルをコピペして作ったtsvファイルを置くと
# 名前、施設名称が両方とも一致した要素を削除します。
import csv
import codecs
import json
from typing import Dict


class DataJson:
    def __init__(self):
        self.tsv_data = './tool/del_tsv/20221130.tsv'
        self.input_json_file = './data/data.json'
        self.output_json_file = './data/data.json'

    def get_data(self) -> Dict:
        f = self.get_csv(self.tsv_data)
        data = self.get_json(self.input_json_file)
        del_row = []
        for i, row in enumerate(f):
            name = row['施設名称'].strip()
            address = row['施設所在地'].strip()
            del_flg = False
            j = 0
            for key in data['features']:
                if key['properties']['name'] == name and key['properties']['address'] == address:
                    # ここで削除する行を格納
                    del_flg = True
                    del_row.append(j)
                j += 1

            if not del_flg:
                print('存在しません。')

        del_row_asc = sorted(del_row)

        for k in range(len(del_row_asc), 0, -1):
            del data['features'][del_row_asc[k-1]]

        return data

    def dumps_json(self, json_data: Dict) -> None:
        with codecs.open(self.output_json_file, "w", "utf-8") as f:
            f.write(
                json.dumps(
                    json_data,
                    ensure_ascii=False,
                    indent=4,
                    separators=(',', ': ')
                )
            )

    def get_csv(self, file_name: str) -> Dict:
        csv_file = open(file_name, 'r', encoding='utf-8',
                        errors='', newline='')
        return csv.DictReader(csv_file, delimiter="\t")

    def get_json(self, file_name: str) -> Dict:
        json_open = open(file_name)
        json_load = json.load(json_open)
        return json_load


if __name__ == "__main__":
    data = DataJson().get_data()
    DataJson().dumps_json(data)
