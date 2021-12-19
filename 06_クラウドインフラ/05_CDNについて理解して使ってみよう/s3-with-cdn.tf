provider "aws" {
  region = "ap-northeast-1"
}

provider "aws" {
  alias = "ohaio"
  region = "us-east-2"
}

locals {
  name = "praha-task-cdn"
  origin_id = "praha-task-cloudfront"
}

resource "aws_s3_bucket" "very-distant-storage" {
  provider = aws.ohaio
  bucket = "${local.name}-ohaio"
  acl    = "private"

  tags = {
    Name = "${local.name}-ohaio"
  }
}

resource "aws_s3_bucket_policy" "allow_access_from_all_users" {
  provider = aws.ohaio
  bucket = aws_s3_bucket.very-distant-storage.id
  policy = data.aws_iam_policy_document.allow_access_from_all_users.json
}

// オブジェクトへの匿名アクセスを許可
data "aws_iam_policy_document" "allow_access_from_all_users" {
  statement {
    principals {
      type = "AWS"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject",
    ]

    resources = [
      "${aws_s3_bucket.very-distant-storage.arn}/*",
    ]
  }
}

// cloudfront
resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.very-distant-storage.bucket_regional_domain_name
    origin_id   = local.origin_id
  }

  enabled = true

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations = ["JP"]
    }
  }

  default_cache_behavior {
    allowed_methods = ["HEAD", "GET"]
    cached_methods = ["HEAD", "GET"]
    target_origin_id = local.origin_id
    viewer_protocol_policy = "allow-all"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  tags = {
    Name = local.name
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
