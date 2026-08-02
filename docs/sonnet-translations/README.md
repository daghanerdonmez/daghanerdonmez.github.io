# Adding a sonnet

Each numbered folder is one published sonnet. The folder name always uses three
digits: `001`, `002`, `003`, and so on.

1. Copy the `001` folder and rename the copy to the next three-digit number.
2. Edit only `sonnet.json` in the new folder; the copied `index.html` is generic.
3. Keep each corresponding original, modern-English, and translated line in the
   same object in the `lines` array. This is what keeps the three columns aligned.
4. Set `group` to `quatrain-1`, `quatrain-2`, `quatrain-3`, or `couplet`. Matching
   group names receive matching color highlights in all three columns.
5. Set optional `previous` and `next` objects when those pages exist. Example:

   ```json
   "previous": { "href": "../001/", "label": "1. Sone" },
   "next": { "href": "../003/", "label": "3. Sone" }
   ```

6. Add the new page to the **Sonnet Translations** list in `docs/index.html`:

   ```html
   <li><a href="sonnet-translations/002/">2. Sone</a></li>
   ```

Do not copy `reader.css` or `reader.js` into each numbered folder. They are shared
by every sonnet, so design changes only need to be made once.
