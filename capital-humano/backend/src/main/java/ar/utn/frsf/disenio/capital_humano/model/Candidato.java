package ar.utn.frsf.disenio.capital_humano.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidatos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder 
public class Candidato {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String apellido;
    private String nombre;
    private String tipoDocumento;
    private String numeroDocumento;
    @Column(unique = true)
    private String numeroCandidato;
    @Builder.Default
    private boolean eliminado = false;
}
