provider "aws" {
  access_key = "${var.aws_access_key}"
  secret_key = "${var.aws_secret_key}"
  region = "${var.region}"
}

locals {
  name = "lifecycle-transition"
}

resource aws_s3_bucket lifecycle-transition {
  bucket = "${local.name}"
  acl    = "private"

  tags = {
    Name = "${local.name}"
  }

  lifecycle_rule {
    id      = "rule-${local.name}"
    enabled = true

    tags = {
      Name = "rule-${local.name}"
    }

    transition {
      days          = 30
      storage_class = "GLACIER"
    }
  }
}
