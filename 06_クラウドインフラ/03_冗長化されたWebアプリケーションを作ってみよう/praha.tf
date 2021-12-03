# ref: https://github.com/pei0804/aws-handson-with-terraform/blob/master/part3/main.tf
variable "aws_access_key" {}
variable "aws_secret_key" {}

provider "aws" {
  access_key = "${var.aws_access_key}"
  secret_key = "${var.aws_secret_key}"
  region = "ap-northeast-1"
}

locals {
  name = "praha"
}

#####
# VPC
#####
resource aws_vpc praha {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "${local.name}-vpc"
  }
}

########
# Subnet
########
# AZ 1a
resource aws_subnet public-1a {
  vpc_id     = aws_vpc.praha.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "ap-northeast-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "${local.name}-public-1a"
  }
}

resource aws_subnet private-1a {
  vpc_id     = aws_vpc.praha.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "ap-northeast-1a"
  map_public_ip_on_launch = false

  tags = {
    Name = "${local.name}-private-1a"
  }
}

# AZ 1c
resource aws_subnet public-1c {
  vpc_id     = aws_vpc.praha.id
  cidr_block = "10.0.3.0/24"
  availability_zone = "ap-northeast-1c"
  map_public_ip_on_launch = true

  tags = {
    Name = "${local.name}-public-1c"
  }
}

resource aws_subnet private-1c {
  vpc_id     = aws_vpc.praha.id
  cidr_block = "10.0.4.0/24"
  availability_zone = "ap-northeast-1c"
  map_public_ip_on_launch = false

  tags = {
    Name = "${local.name}-private-1c"
  }
}

#################
## Security Group
#################

## EC2用
# in: ALBからのHTTPを許可
# out: 全て許可
resource aws_security_group sg-web {
  vpc_id      = aws_vpc.praha.id
  name        = "${local.name}-web"
}

resource "aws_security_group_rule" "out_web" {
  type              = "egress"
  from_port         = -1
  to_port           = -1
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.sg-web.id
}

resource "aws_security_group_rule" "in_from_alb" {
  type = "ingress"
  from_port = 80
  to_port = 80
  source_security_group_id = aws_security_group.sg-alb.id
  protocol = "tcp"
  security_group_id = aws_security_group.sg-web.id
}

## ALB用
# in: HTTPを許可
# out: 全て許可
resource aws_security_group sg-alb {
  vpc_id = aws_vpc.praha.id
  name   = "${local.name}-alb"
}

resource "aws_security_group_rule" "out_alb" {
  type              = "egress"
  from_port         = -1
  to_port           = -1
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.sg-alb.id
}

resource "aws_security_group_rule" "in_http" {
  type = "ingress"
  from_port = 80
  to_port = 80
  cidr_blocks = ["0.0.0.0/0"]
  protocol = "tcp"
  security_group_id = aws_security_group.sg-alb.id
}

###################
## Internet Gateway
###################
resource aws_internet_gateway praha {
  vpc_id = aws_vpc.praha.id
}

##############
## Route Table
##############

## public
resource aws_route_table praha_public {
  vpc_id = aws_vpc.praha.id
  tags = {
    Name = local.name
  }
}

resource aws_route igw {
  route_table_id = aws_route_table.praha_public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id = aws_internet_gateway.praha.id
}

resource aws_route_table_association praha_public {
  subnet_id = aws_subnet.public-1a.id
  route_table_id = aws_route_table.praha_public.id
}

###############
## EC2 Instance
###############
data aws_ssm_parameter amzn2_ami {
  name = "/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2"
}

resource aws_instance private-1a {
  ami = data.aws_ssm_parameter.amzn2_ami.value
  instance_type = "t2.micro"
  iam_instance_profile = aws_iam_instance_profile.praha.id
  vpc_security_group_ids = [aws_security_group.praha.id]

  subnet_id = aws_subnet.private-1a.id

  tags = {
    Name = "${local.name}-private-1a"
  }
}

resource aws_instance private-1c {
  ami = data.aws_ssm_parameter.amzn2_ami.value
  instance_type = "t2.micro"
  iam_instance_profile = aws_iam_instance_profile.praha.id
  vpc_security_group_ids = [aws_security_group.praha.id]

  subnet_id = aws_subnet.private-1c.id

  tags = {
    Name = "${local.name}-private-1c"
  }
}

#######################
## IAM Instance Profile
#######################
resource aws_iam_instance_profile praha {
  name = local.name
  role = aws_iam_role.praha.name
}

resource aws_iam_role praha {
  name = local.name
  path = "/"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "sts:AssumeRole",
            "Principal": {
               "Service": "ec2.amazonaws.com"
            },
            "Effect": "Allow",
            "Sid": ""
        }
    ]
}
EOF
}

resource aws_iam_role_policy_attachment ssm {
  role = aws_iam_role.praha.id
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

#####
## ALB
#####
resource "aws_lb" "praha" {
  name               = local.name
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.sg-alb.id]
  subnets            = [aws_subnet.public-1a.id, aws_subnet.public-1c.id]

  enable_deletion_protection = false
}

resource "aws_lb_target_group" "praha" {
  name     = "${local.name}-target-group"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.praha.id
}

resource "aws_lb_target_group_attachment" "praha-1a" {
  target_group_arn = aws_lb_target_group.praha.arn
  target_id        = aws_instance.private-1a.id
  port             = 80
}

resource "aws_lb_target_group_attachment" "praha-1c" {
  target_group_arn = aws_lb_target_group.praha.arn
  target_id        = aws_instance.private-1c.id
  port             = 80
}
