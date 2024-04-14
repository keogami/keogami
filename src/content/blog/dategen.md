---
title: Defining the maths to generate intuitive date series
publishDate: 2024-04-14
tags: ["rust", "time-series"]
summary: |
  Using unix timestaps for generating a date series has many nuances that must
  be taken care of. In this writeup, I define a set of algorithms to generate date
  series that are more intuitive to humans at the expense of being less accurate.
---

Using unix timestamps for generating a date series based on intervals like
monthly or quaterly etc, can be dificult. How many days does a month have? 30?
31? 28? 29? No matter which number you pick: it will inevitably lead to the
problem of, what I call, `time swaying`.

NOTE: I will be using `dd/mm/yyyy` format for dates.

```rust
// Say we define a month as 30 days,
// then starting from 01/01/2024 our series would look like
01/01/2024
31/01/2024
01/03/2024
31/03/2024
30/04/2024
30/05/2024
29/06/2024 // we are now swaying backwards
29/07/2024
28/08/2024
27/09/2024
27/10/2024
26/11/2024
```

If we were to define a month as `31days`, the dates will sway forwards. Why does
the sway happen is left as an exercise for the reader to figure out. Similar
problems will be faced when generating a weekly series, quaterly series, yearly
series, etc.

In this writeup, I will define a set of algorithms and operations that will help
us generate date series that are more intuitive to humans, albeit at the expense
of accuracy.

---

## Motivation
Generating a date series is required whenever a schedule is to be defined.
For example, "schedule a weekly meeting", or "scan the systems every month", or
"remind me to clean the room every week".

Us humans tend to ignore the nuances of the gregorian calendar, when saying
things "every month" or "every week"; in order to reduce the cognitive burden it
brings upon us. And I believe the computers should reflect this tendency and
embrace our human nature.

So when generating a monthly series I would expect it to look like:
```rust title=MONTHLY
01/01/2024
01/02/2024
01/03/2024
01/04/2024
01/05/2024
01/06/2024
01/07/2024
...
```

or a weekly series:
```rust title=WEEKLY
07/01/2024
14/02/2024
21/03/2024
28/04/2024
07/05/2024 // notice the gap isn't exactly 7 days
14/06/2024
21/07/2024
...
```

Notice that these series are not accurate, that is, the gap between the dates
changes. However, the dates are much more intuitive, as in, I can easily
memorize them and/or anticipate them without thinking much.

The rest of this writeup will be motivated by the desire to find a way of
generating series that have this property.

## Date
The most common method of defining a date is using a [unix timestamp](https://en.wikipedia.org/wiki/Unix_time).
However, the unix timestamp mashes up the day, month and year into a single
number which will get in our way. So we will define a separate data structure
for keeping dates.

We will use an ordered triple of `(year, month, day)` where the day and month
will be 0-indexed. That is, `01/01/2024` would be represented as `(2024, 0, 0)`.

```rust title=date.rs
pub struct Date {
  day: usize,
  month: usize,
  year: usize,
}
```

## Delta: Change in time
A series is essentially an artithematic progression defined as:

```rust
a[n] = a[0] + n*d
```

Where `a` is the series we want, `a[0]` is the starting point, and `d` is the difference between each item.
Let's only consider the case of `n=1`.

```rust
a[1] = a[0] + d
```
Here, as an example, both `a[0]` and `d` can be integers as the operation `+`
is defined on integers. For our case we will clearly have `a[0]` as a `Date`,
but we can't have `d` be a date as it wouldn't make logical sense to define `Date + Date`.

Therefore, we must define `d` as, say, `Delta`; and we must define the
operation `Date + Delta` to return a `Date`.

---

Using the number of miliseconds or days as `Delta` will force us to define
`1month`, which we know is problematic. And as such we would like to avoid that.
So we will define `Delta` in a similar fashion as our `Date`.

We will use the ordered triple `(d_years, d_months, d_days)`.

```rust title=delta.rs
pub struct Delta {
  days: usize,
  months: usize,
  years: usize,
}
```

Now, we can naively (and incorrectly) define `Date + Delta` as `(year + d_years,
months + d_months, days + d_days)`. We can build upon that by taking into
account that the month and day are cyclic and modulate between their ranges. We
can use modular arithematic to help us with that.

```rust title="Add Date and Delta"

impl std::ops::Add<Delta> for Date {
    type Output = Self;

    fn add(self, rhs: D) -> Self::Output {
        let delta: Delta = rhs.into();
        let day = self.day + delta.days;

        // The day modulates in odd ways, so let's use 31 to keep it simple
        // for now
        let day = day.rem_euclid(31);
        let overflow = day.div_euclid(31);

        let month = self.month + delta.months + overflow;

        // we know for a fact that there are 12months
        let month = month.rem_euclid(12);
        let overflow = month.div_euclid(12);

        let year = self.year + delta.years + overflow;

        Self { year, day, month }
    }
}
```

This is better. Aside from defining a month to be 31, we have another edge case.
Consider adding `1month` to `31/01/2024`. Based on our algorithm, we would get
`31/02/2024`, which clearly doesn't exist.

For both of these issues we will have to face our biggest enemy.

## The Greogorian Calendar
If you have ever seen a calendar, then it's most likely to be the [gregorian
calendar](https://en.wikipedia.org/wiki/Gregorian_calendar). For our purposes,
we will look at it as the root of all evil. In the gregorian calendar, each
month is assigned a number of days except for february, for which the number
of days depends on the year.

Let's define a function that returns us the number of days for a pair month/
year.

```rust title="Number of Days"
pub fn is_leap_year(year: usize) -> bool {
    match year {
        y if y % 400 == 0 => true,
        y if y % 100 == 0 => false,
        y if y % 4 == 0 => true,
        _ => false,
    }
}

pub fn days_in(month: Month, year: usize) -> usize {
    match month {
        Month::February => {
            if is_leap_year(year) {
                29
            } else {
                28
            }
        }

        Month::January
        | Month::March
        | Month::May
        | Month::July
        | Month::August
        | Month::October
        | Month::December => 31,

        _ => 30,
    }
}
```
