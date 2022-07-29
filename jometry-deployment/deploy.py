import boto3 # type: ignore
from botocore.exceptions import ClientError # type: ignore
from pathlib import Path
from typing import List

def get_s3_client():
    return boto3.client('s3')

def upload_to_s3(pathlist: List[Path]):
    try:
        s3_client = get_s3_client()
        for path in pathlist:
            response = s3_client.upload_file(str(path), 'j-ometry', str(path.relative_to('site')), \
                ExtraArgs={'CacheControl': 'max-age=300'})
    except ClientError as e:
        print(e)

if __name__ == '__main__':
    pathlist = Path('site').glob('**/*.*')
    upload_to_s3(pathlist)