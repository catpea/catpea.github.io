Summary of Behavior


```JavaScript

get navPager(){
  return Array.from({length: this.pagerRadius * 2 + 1}, (_, i) =>  (this.currentPage - this.pagerRadius + i + this.totalPages) % this.totalPages );
}

```

This code snippet generates an array of page indices for a pager, centered around the current page and wrapping around the total number of pages.

The array length is calculated as pagerRadius * 2 + 1, ensuring a range of pages on both sides of the current page.

For each index i, it computes the page number by offsetting from currentPage by -pagerRadius + i.

It adds totalPages before applying % totalPages to ensure correct wrapping for negative indices.

The result is an array of valid page indices, always within 0 to totalPages - 1.

This is typically used for paginated navigation UI to display a window of page links centered around the current page.

### What the Function Does

The `cyclicPager` function helps you create a list of page numbers that "wrap around." Imagine you're on a carousel, and when you get to the last horse (or page), you go back to the first one. This function is especially useful in situations like navigating through pages of a website.

### How It Works

1. **Parameters**:
   - **`current`**: This is the current page number (like the horse you're on).
   - **`total`**: This is the total number of pages (or horses) available.
   - **`radius`**: This determines how many pages before and after the current page you want to see. It's like looking around you while on the carousel.

2. **Creating the List**:
   - The function creates a list of page numbers based on the `radius`. It combines the current page and the numbers around it, wrapping around if needed.

### The Magic of Modulo (%)

The modulo operator, represented by `%`, is a way to keep numbers within a specific range. Here’s how it works:

- **Example**: Let’s say you have 10 total pages (0 to 9) and you're trying to move to a page number.
- If you want to go to page 11, it doesn't exist. But if you use the modulo operator:
  - `11 % 10` gives you `1`. It means that when you exceed the last number (9), you come back to the beginning (0).

So the modulo operation helps "wrap around" the page numbers. In the `cyclicPager` function, every time it calculates a new page number, it ensures that if the result goes beyond the total number of pages, it starts over from the beginning.

### Putting It All Together

When you call `cyclicPager(0, 10, 3)`:

- It looks for the current page (`0`) and finds the three pages before and after it.
- Using the modulo, it fetches pages like this:
  - -3 wraps to page 7,
  - -2 wraps to page 8,
  - -1 wraps to page 9,
  - 0 stays as page 0,
  - 1 goes to page 1,
  - 2 goes to page 2,
  - 3 goes to page 3.

So, the result is `[7, 8, 9, 0, 1, 2, 3]`.

In short, the modulo operator is like your guide on a carousel, helping you enjoy all the pages without falling off the ride!
