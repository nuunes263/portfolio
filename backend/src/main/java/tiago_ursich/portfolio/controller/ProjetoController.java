package tiago_ursich.portfolio.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tiago_ursich.portfolio.model.Projeto;
import tiago_ursich.portfolio.service.ProjetoService;

import java.util.List;

@RestController
@RequestMapping("/api/projetos")
@RequiredArgsConstructor
public class ProjetoController {

    private final ProjetoService service;

    @GetMapping
    public List<Projeto> listar() {
        return service.listarTodos();
    }

    @PostMapping
    public ResponseEntity<Projeto> criar(@RequestBody @Valid Projeto projeto) {
        return ResponseEntity.status(201).body(service.criar(projeto));
    }

    @PutMapping("/{id}")
    public Projeto atualizar(@PathVariable Long id, @RequestBody @Valid Projeto projeto) {
        return service.atualizar(id, projeto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
