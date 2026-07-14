using Microsoft.AspNetCore.Mvc;
using TodoApi.Models;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodoController : ControllerBase
{
    private static readonly List<TodoItem> _todos = new()
    {
        new TodoItem { Id = 1, Title = "Buy groceries", IsComplete = false },
        new TodoItem { Id = 2, Title = "Walk the dog",  IsComplete = true  },
        new TodoItem { Id = 3, Title = "Read a book",   IsComplete = false }
    };
    private static int _nextId = 4;

    private readonly ILogger<TodoController> _logger;

    public TodoController(ILogger<TodoController> logger) => _logger = logger;

    // GET /api/todo
    [HttpGet]
    public ActionResult<IEnumerable<TodoItem>> GetAll()
    {
        _logger.LogInformation("Fetching all todo items");
        return Ok(_todos);
    }

    // GET /api/todo/{id}
    [HttpGet("{id:int}")]
    public ActionResult<TodoItem> GetById(int id)
    {
        var item = _todos.FirstOrDefault(t => t.Id == id);
        if (item is null)
            return NotFound();
        return Ok(item);
    }

    // POST /api/todo
    [HttpPost]
    public ActionResult<TodoItem> Create([FromBody] TodoItem item)
    {
        item.Id = _nextId++;
        _todos.Add(item);
        _logger.LogInformation("Created todo item {Id}: {Title}", item.Id, item.Title);
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    // PUT /api/todo/{id}
    [HttpPut("{id:int}")]
    public IActionResult Update(int id, [FromBody] TodoItem updated)
    {
        var item = _todos.FirstOrDefault(t => t.Id == id);
        if (item is null)
            return NotFound();

        item.Title = updated.Title;
        item.IsComplete = updated.IsComplete;
        _logger.LogInformation("Updated todo item {Id}", id);
        return NoContent();
    }

    // DELETE /api/todo/{id}
    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        var item = _todos.FirstOrDefault(t => t.Id == id);
        if (item is null)
            return NotFound();

        _todos.Remove(item);
        _logger.LogInformation("Deleted todo item {Id}", id);
        return NoContent();
    }
}
