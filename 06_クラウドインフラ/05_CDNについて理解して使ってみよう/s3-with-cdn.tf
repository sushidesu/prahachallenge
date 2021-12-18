provider "aws" {
  region = "ap-northeast-1"
}

provider "aws" {
  alias = "ohaio"
  region = "us-east-2"
}

locals {
  name = "praha-task-cdn"
}

resource "aws_s3_bucket" "very-distant-storage" {
  provider = aws.ohaio
  bucket = "${local.name}-ohaio"
  acl    = "public-read"

  tags = {
    Name = "${local.name}-ohaio"
  }
}
