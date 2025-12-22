---
title: "A Brief summary of Linear Algebra"
date: "2025-12-22T12:00:00.000Z"
template: "post"
draft: false
slug: "/posts/a-brief-summary-of-linearalgebra"
category: "Math"
tags:
  - "Linear algebra"
description: "a brief summary of linear algebra."
socialImage: "./image.jpg"
---
## Chapter 1

### 1.1 Vector
Origin of trigonometric formulas:    (dot product-- $\theta$ is the angle between two vectors)
$$
\cos\theta=\cos(\beta-\alpha)=\cos\alpha\cos\beta+\sin\alpha\sin\beta
$$
![[Pasted image 20240924101929.png|200]]

right multiplication vs left multiplication    column operation vs row operation
![[Pasted image 20241209191936.png#||500]]
![[Pasted image 20241209192003.png||500]]
### 1.2 Dot Product
Inequality formulas:
$$
\begin{aligned}&|v\cdot w|\leq\left\|v\right\|\left\|w\right\|\\&\|v+w\|\leq\|v\|+\|w\|
\end{aligned}
$$
For $v=(a,b),w=(b,a)$   =>  $2ab \le  a^2+b^2$   if $x=a^{2} \quad  y=b^2$  =>  $\sqrt{xy}\leq\frac{x+y}2.$  (geometric mean $\le$ arithmetic mean)

### 1.3 Matrices
$x(t)=t^2$
Forward:  $x(t+1)-x(t)=2t+1$
Backward:  $x(t)-x(t-1)=2t-1$
Centered:   $\frac{x(t+1)-x(t-1)}{2}=2t$

## Chapter 2
row picture    hyperlanes meeting at a single point
column picture     column vectors combination to produce the  target vector b

elimination  ---- back substitution
U just keeps the diagonal of A when A is lower triangular.
$$
\begin{bmatrix} 3 & 0 & 0 \\ 6 & 2 & 0 \\ 9 & -2 & 1 \end{bmatrix} \begin{bmatrix} x \\ y \\ z \end{bmatrix} = \begin{bmatrix} 3 \\ 8 \\ 9 \end{bmatrix}
\quad- > \quad
\begin{bmatrix} 3 & 0 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} x \\ y \\ z \end{bmatrix} = \begin{bmatrix} 3 \\ 2 \\ 2 \end{bmatrix}
$$
A is factored into LU    A=LU   u is upper triangular  L is lower triangular
**Notice: how to get pivot?** 2 - 3/6 * 0=2

> [!this is elimination without row exchanges!]
> first we can conclude that  $EA=U \quad  A=LU (L=E^{-1})$

A=PLU P is permutation matrix ----- row exchange for pivot
A=LDU   D is diagonal matrix.  symmetric 

==Gauss-Jordan==
$$
Multiply \quad \begin{bmatrix} A & I  \end{bmatrix} \quad by \quad A^{-1} \quad to \quad get \quad \begin{bmatrix} I & A^{-1}  \end{bmatrix}
$$
Diagonally dominant matrices are invertible. Each $|a_{ii}|$ dominates its row.
