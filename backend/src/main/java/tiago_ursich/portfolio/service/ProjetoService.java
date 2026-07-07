package tiago_ursich.portfolio.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tiago_ursich.portfolio.model.Projeto;
import tiago_ursich.portfolio.repository.ProjetoRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjetoService {

    private final ProjetoRepository repository;

    public List<Projeto> listarTodos() {
        return repository.findAllByOrderByCriadoEmDesc();
    }

    public Projeto criar(Projeto projeto) {
        return repository.save(projeto);
    }

    public Projeto atualizar(Long id, Projeto dados) {
        Projeto projeto = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Projeto não encontrado: " + id));
        projeto.setTitulo(dados.getTitulo());
        projeto.setDescricao(dados.getDescricao());
        projeto.setTecnologias(dados.getTecnologias());
        projeto.setLink(dados.getLink());
        projeto.setImagemUrl(dados.getImagemUrl());
        return repository.save(projeto);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
