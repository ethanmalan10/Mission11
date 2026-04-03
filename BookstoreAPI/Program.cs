using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreDB")));

var app = builder.Build();

app.UseCors();

app.MapGet("/api/books", async (BookstoreContext db,
    int page = 1,
    int pageSize = 5,
    string sortOrder = "asc",
    string category = "") =>
{
    var query = db.Books.AsQueryable();

    if (!string.IsNullOrEmpty(category))
        query = query.Where(b => b.Category == category);

    query = sortOrder == "desc"
        ? query.OrderByDescending(b => b.Title)
        : query.OrderBy(b => b.Title);

    var totalCount = await query.CountAsync();
    var books = await query
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    return Results.Ok(new { totalCount, books });
});

app.MapGet("/api/books/categories", async (BookstoreContext db) =>
    await db.Books.Select(b => b.Category).Distinct().OrderBy(c => c).ToListAsync());

app.MapPost("/api/books", async (BookstoreContext db, Book book) =>
{
    db.Books.Add(book);
    await db.SaveChangesAsync();
    return Results.Created($"/api/books/{book.BookID}", book);
});

app.MapPut("/api/books/{id}", async (BookstoreContext db, int id, Book updated) =>
{
    var book = await db.Books.FindAsync(id);
    if (book is null) return Results.NotFound();

    book.Title = updated.Title;
    book.Author = updated.Author;
    book.Publisher = updated.Publisher;
    book.ISBN = updated.ISBN;
    book.Classification = updated.Classification;
    book.Category = updated.Category;
    book.PageCount = updated.PageCount;
    book.Price = updated.Price;

    await db.SaveChangesAsync();
    return Results.Ok(book);
});

app.MapDelete("/api/books/{id}", async (BookstoreContext db, int id) =>
{
    var book = await db.Books.FindAsync(id);
    if (book is null) return Results.NotFound();

    db.Books.Remove(book);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();

class BookstoreContext : DbContext
{
    public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options) { }
    public DbSet<Book> Books { get; set; }
}

class Book
{
    public int BookID { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Publisher { get; set; } = string.Empty;
    public string ISBN { get; set; } = string.Empty;
    public string Classification { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int PageCount { get; set; }
    public decimal Price { get; set; }
}
