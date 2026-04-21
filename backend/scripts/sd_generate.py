#!/usr/bin/env python3
import argparse
from diffusers import StableDiffusionPipeline
import torch


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--prompt', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()

    pipe = StableDiffusionPipeline.from_pretrained(
        'runwayml/stable-diffusion-v1-5',
        torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32
    )
    if torch.cuda.is_available():
        pipe = pipe.to('cuda')

    image = pipe(args.prompt).images[0]
    image.save(args.output)


if __name__ == '__main__':
    main()
