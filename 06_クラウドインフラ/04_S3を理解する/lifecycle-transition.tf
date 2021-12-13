locals {
  name_transition = "lifecycle-transition"
}

resource aws_s3_bucket lifecycle-transition {
  bucket = "${local.name_transition}"
  acl    = "private"

  tags = {
    Name = "${local.name_transition}"
  }

  lifecycle_rule {
    id      = "rule-${local.name_transition}"
    enabled = true

    tags = {
      Name = "rule-${local.name_transition}"
    }

    transition {
      days          = 30
      storage_class = "GLACIER"
    }
  }
}
