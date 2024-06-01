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
us generate date series that are more intuitive to humans, at the expense
of accuracy.

---

## Motivation
Generating a date series is required whenever a schedule is to be defined.
For example, "schedule a weekly meeting", or "scan the systems every month", or
"remind me to clean the room every week".

Us humans tend to ignore the nuances of the calendar, when saying
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
14/01/2024
21/01/2024
28/01/2024
07/02/2024 // notice the gap isn't exactly 7 days
14/02/2024
21/02/2024
...
```

or a month's end series:
```rust title="MONTH'S END"
31/01/2024
29/02/2024
31/03/2024
30/04/2024
31/05/2024
30/06/2024
31/07/2024
...
```

Notice that these series are not accurate, that is, the gap between the dates
changes. However, the dates are much more intuitive, as in, I can easily
memorize them and anticipate them without thinking much.

The rest of this writeup will be motivated by the desire to find a way to
generate a series that have this property.

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
Our series is essentially an artithematic progression defined as:

```rust
a[n] = a[0] + n*d
```

Where `a` is the series we want, `a[0]` is the starting point, and `d` is the difference between each date.
Let's only consider the case of `n = 1`.

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
// This is how the Gregorian Calendar defines a leap year.
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

With this knowledge we can now go back and try to improve the way we get our
day. I have chosen to use similar logic as [`std::num::Saturaing`](https://doc.rust-lang.org/stable/std/num/struct.Saturating.html)
towards `days_in(month, year)` instead of simply modulating, so as to
potentially skipping months.

```rust title="Add Date and Delta" ins={12-13}
impl std::ops::Add<Delta> for Date {
    type Output = Self;

    fn add(self, rhs: D) -> Self::Output {
        let delta: Delta = rhs.into();
        let day = self.day + delta.days;

        // snipped...
        
        let year = self.year + delta.years + overflow;

        // redefining day after computing computing new month and year
        let day = std::cmp::min(day, days_in(month, year));

        Self { year, day, month }
    }
}
```

The reason we recompute `day` after evalauting `month` and `year` at the end is
to avoid the edge cases such as adding the delta `(0, 1, 1)` to `29/01/2024`.

Finally, we can get rid of the hardcoded number of days in a month by replacing
it with `days_in(month, year)`.

```rust title="Add Date and Delta" ins={9-10} del={7-8}
impl std::ops::Add<Delta> for Date {
    type Output = Self;

    fn add(self, rhs: D) -> Self::Output {
        // snipped...

        let day = day.rem_euclid(31);
        let overflow = day.div_euclid(31);
        let day = day.rem_euclid(days_in(self.month, self.year));
        let overflow = day.div_euclid(days_in(self.month, self.year));

        // snipped...
    }
}
```

With this, we now have a fairly decent definition of `Date + Delta` and we can
now calculate `a[1]` for any given delta and `a[0]`. Now it should be trivial to
extend to arbitrary `n`'s, right? ...right?

## Associativity of `Date + Delta + Delta + ...`

Consider the case of `n = 2`, we can formulate `a[2]` as:

```rust
a[2] = a[0] + 2*d;
     = a[0] + d + d;
     = ((a[0] + d) + d);
```

This works for deltas like, `d = (0, 1, 0)` or `d = (0, 0, 1)` but with `d = (0,
0, 2)` or `d = (0, 0, 7)` we run into the same `Time Swaying` problem as before.

For example,

```rust title=WEEKLY
07/01/2024
14/01/2024
21/01/2024
28/01/2024
04/02/2024
11/02/2024
18/02/2024
...
```

This is due to the fact that the range of `days_in` is `{28, 29, 30, 31}` and
`2` or `7` doesn't fully divide most of them.

We can pick the number of days in a month depending on the number of days in our
delta to make sure they fit together perfectly. But that is a step back.

Another approach will be to add the deltas together and modulate them instead.
```rs
a[2] = a[0] + (d + d)
```

This introduces the worst concept in this entire system:

### Cycles

Cycles are objects that build upon deltas to capture the concept of something
repeating. In our system, they are simply the definition of addition for two
deltas. But they also allow us to specify how to modulate the day component in
our delta.

Let's use an ordered tuple of `(delta, cycle)` where `delta` is the delta
we are gonna another delta to and `cycle` is the number of days we are gonna
modulate the day over.

```rust title=cycle.rs
pub struct Cycle {
    /// The number of days considered in a month when adding delta's to a cycle.
    cycle: usize,

    /// The change over time.
    delta: Delta,
}
```

For example a weekly cycle will be the tuple `((0, 0, 7), 28)`.

Aside: Here `cycle` can be derived implicitly from the day component of the
delta, but I am opting to keep it explicit until I am sure there's no edge case
to consider.

We can add a delta to this cycle with the following definition.

```rust title=cycle.rs
impl std::ops::Add<Delta> for Cycle {
    type Output = Self;

    fn add(self, rhs: Delta) -> Self::Output {
        let new_d = self.delta.days + rhs.days;
        let overflow = new_d.div_euclid(self.cycle);
        let new_d = new_d.rem_euclid(self.cycle);

        let new_m = self.delta.months + rhs.months + overflow;
        let overflow = new_m.div_euclid(12);
        let new_m = new_m.rem_euclid(12);

        let new_y = self.delta.years + rhs.years + overflow;

        ((new_y, new_m, new_d).into(), self.cycle).into()
    }
}
```

We can also define some popular cycles like:
```rust
DAILY = ((0, 0, 1), 31);
WEEKLY = ((0, 0, 7), 28);
BIWEEKLY = ((0, 0, 14), 28);
MONTHLY = ((0, 1, 0), 31);
QUATERLY = ((0, 3, 0), 31);
HALF_YEARLY = ((0, 6, 0), 31);
YEARLY = ((1, 0, 0), 31);
```

At this point it is trivial to extend from `n = 2` to arbitrary `n`s.

---

## Putting it all together

I have placed this all together in a crate and wrapped them in a nice iterator
interface. This allows me to write code like:

```rust title=usage.rs
let dates = date!(31 / 1 / 2024)
    .iter()
    .with_cycle(MONTHLY)
    .take(12)
    .map(|d| d.to_string())
    .collect::<Vec<_>>()
    .join("\n");
```

Which produces the dates:
``` title=result
31/01/2024
29/02/2024
31/03/2024
30/04/2024
31/05/2024
30/06/2024
31/07/2024
31/08/2024
30/09/2024
31/10/2024
30/11/2024
31/12/2024
```

or
```rust title=usage.rs
let dates = date!(7 / 1 / 2024)
    .iter()
    .with_cycle(WEEKLY)
    .take(12)
    .map(|d| d.to_string())
    .collect::<Vec<_>>()
    .join("\n");
```

which produces:
```rust
07/01/2024
14/01/2024
21/01/2024
28/01/2024
07/02/2024
14/02/2024
21/02/2024
28/02/2024
07/03/2024
14/03/2024
21/03/2024
28/03/2024
```
---

## Conclusion
We were able to define some methods to achieve the objective that we set out
for, but along the way we noticed there are a bunch of edge cases to care of.
And because this is not a formal proof of the method, I can't guarantee there
are no other edge cases in our system.

However, I am quite sure that exposing this idea to the public will bring in
some extremely valuable scrutiny and critics and improvements. I welcome you,
reader, to scrutinize the concepts stated here so we can together get the
applications to adopt more human centric methods of auto-scheduling.

To save you all the trouble, I will releasing an implementation of these methods
as a crate in the near future.

Thank you for reading.
