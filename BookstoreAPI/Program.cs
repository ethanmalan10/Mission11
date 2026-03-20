using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod());
});

builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreDB")));

var app = builder.Build();

app.UseCors();

app.MapGet("/api/books", async (BookstoreContext db,
    int page = 1,
    int pageSize = 5,
    string sortOrder = "asc") =>
{
    var query = sortOrder == "desc"
        ? db.Books.OrderByDescending(b => b.Title)
        : db.Books.OrderBy(b => b.Title);

    var totalCount = await query.CountAsync();
    var books = await query
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    return Results.Ok(new { totalCount, books });
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
