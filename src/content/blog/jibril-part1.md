---
title: "Jibril Devlog 0: Everyday use for YOLO models"
publishDate: 2025-12-12
tags: ["python", "yolo", "jibril"]
summary: |
    YOLO is an amazing set of models, but can they integrate into everyday life?
    We start by defining a use case, and then experimenting to find the bulk of
    data needed to personalize the model.
---

## Motivation

Computer vision models have been around for a good while with great,
high-stakes industrial use cases ranging from agriculture to privacy threatening
surveillance. I sought to find a low-stakes non-commercial everyday use case
that directly impacts a person, hoping to make these models more ubiquitous
and boring.

## Problem Statement

My gallery remains a cluttered, horribly unorganised mess. A mix of screenshots,
art, portraits and what not. I would love them to be neatly organized in
directories.

We generalize this to be: organize a set of images into a user-defined set of directories.

**Constraint**: There shouldn't be a need to go through a special UI to define the categories.

**Constraint**: A raspberry pi 5 with no gpu should be enough to execute the solution.

**Constraint**: It shouldn't take more an than hour to get system running.

**Target audience**: We will be less ambitious here and target a typical HomeLab owner.


## YOLO-CLS

Ultralytics graciously provides YOLOvN-cls models for classifiction problems,
and also provides pretrained weights for those models. A perfect base to then
personalize over.

However, how many images do we need to train our model over until it gets good
enough to be left alone? How much manual labor is needed until the model becomes
self-sufficient?

But before that, let's define how our solution would look like.


## Interface

To keep it simple, we will keep the interface spiritually akin to:
```bash
jibril images/
```

where the `images/` directory is organized by the user as:
```
images
├── category0
│   ├── image0.png
│   ├── image1.png
│   └── image2.png
├── category1
│   ├── image0.png
│   ├── image1.png
│   └── image2.png
├── category2
│   ├── image0.png
│   ├── image1.png
│   └── image2.png
├── uncategorized-image0.png
├── uncategorized-image1.png
├── uncategorized-image2.png
└── uncategorized-image3.png
```

And jibril is essentially a function that moves images under `images/` to the
appropriate `category` directory, running as a daemon.

Additionally, nature of each image and category is unknown.

Each category _must_ have _some_ images to act as "seeds".

Finally, jibril will create a `_unsure` directory to keep the images where its
not confident enough with its classification.


## Traning Stategy

Coming back to the questions laid out earlier, how many images should each
category have for training the model before it becomes effective.

Should the user manually categorize at least a hundred images before reaching
out for jibril? Or perhaps we can train our model over just a handful of images,
then predict, ask the user for guidance, retrain, then repeat?

If we take the latter approach, how many iterations will it take before the
model becomes self-sufficient and won't need as much hand holding.

The latter approach fits our constraint for setup time. 
