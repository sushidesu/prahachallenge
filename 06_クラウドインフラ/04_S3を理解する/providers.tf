provider "aws" {
  access_key = "${var.aws_access_key}"
  secret_key = "${var.aws_secret_key}"
  region = "${var.region}"
}

provider "aws" {
  alias  = "central"
  region = "ap-northeast-2"
  access_key = "${var.aws_access_key}"
  secret_key = "${var.aws_secret_key}"
}
