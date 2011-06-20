// Generated code, do not edit
window.examples = [
  ["rho-iota","⍝  ⍳ n  generates a list of numbers from 0 to n−1\n⍝  n n ⍴ A  arranges the elements of A in an n×n matrix\n\n5 5 ⍴ ⍳ 25"],
  ["mult","⍝ Multiplication table\n⍝  a × b    scalar multiplication, \"a times b\"\n⍝  ∘.       is the \"outer product\" operator\n⍝  A ∘.× B  every item in A times every item in B\n(⍳ 10) ∘.× ⍳ 10"],
  ["sierpinski","⍝ Sierpinski's triangle\n\n⍝ It's a recursively defined figure.\n⍝ We will use the following definition:\n⍝\n⍝   * the Sierpinski triangle of rank 0 is a one-by-one matrix 'X'\n⍝\n⍝   * if A is the triangle of rank n, then rank n+1 would be\n⍝     the two-dimensional catenation:\n⍝             S 0\n⍝             S S\n⍝     where \"0\" is an all-blank matrix same size as S.\n\nf←{(⍵,(⍴⍵)⍴0)⍪⍵,⍵}\n' X'[(f⍣4) 1 1 ⍴ 1]"],
  ["erato","⍝ Sieve of Eratosthenes\n(2=+⌿0=A∘.∣A)/A←⍳200"],
  ["life","⍝ Conway's game of life\n\n⍝ This example was inspired by the impressive demo at\n⍝ http://www.youtube.com/watch?v=a9xAKttWgP4\n\n⍝ Create a matrix:\n⍝     0 1 1\n⍝     1 1 0\n⍝     0 1 0\ncreature ← (3 3 ⍴ ⍳ 9) ∈ 1 2 3 4 7   ⍝ Original creature from demo\ncreature ← (3 3 ⍴ ⍳ 9) ∈ 1 3 6 7 8   ⍝ Glider\n\n⍝ Place the creature on a larger board, near the centre\nboard ← ¯1 ⊖ ¯2 ⌽ 5 7 ↑ creature\n\n⍝ A function to move from one generation to the next\nlife ← {∨/ 1 ⍵ ∧ 3 4 = ⊂+/ +⌿ 1 0 ¯1 ∘.⊖ 1 0 ¯1 ⌽¨ ⊂⍵}\n\n⍝ Show first three generations\nboard (life board) (life life board)"],
  ["langton","⍝ Langton's ant\n⍝\n⍝ It lives in an infinite boolean matrix and has a position and a direction\n⍝ (north, south, east, or west).  At every step the ant:\n⍝   * turns left or right depending on whether the occupied cell is true or false\n⍝   * inverts the value of the occupied cell\n⍝   * moves one cell forward\n⍝\n⍝ In this program, we use a finite matrix with torus topology, and we keep the\n⍝ ant in the centre, pointing upwards (north), rotating the whole matrix\n⍝ instead.\n\nm ← 5\nn ← 1+2×m\n\nA0 ← (−m) ⊖ (−m) ⌽ n n ↑ 1 1 ⍴ 1\nnext ← {0≠A0−¯1⊖⌽[⍵[m;m]]⍉⍵}\n\n' X'[(next⍣300) A0]"]
];