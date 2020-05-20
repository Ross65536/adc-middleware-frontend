
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useKeycloak, KeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak.js';

import './App.css';

import { getJson, catchHttpErrors } from './lib/http.js';
import PublicEndpoint from './components/public-endpoint.js';
import GetEndpoint from './components/get-endpoint.js';
import PostEndpoint from './components/post-endpoint.js';

const REPERTOIRE_FIELDS = ["repertoire_id", "repertoire_name", "repertoire_description", "study.study_id", "study.study_title", "study.study_type.value", "study.study_type.id", "study.study_description", "study.inclusion_exclusion_criteria", "study.grants", "study.collected_by", "study.lab_name", "study.lab_address", "study.submitted_by", "study.pub_ids", "study.keywords_study", "subject.subject_id", "subject.synthetic", "subject.organism.value", "subject.organism.id", "subject.sex", "subject.age_min", "subject.age_max", "subject.age_unit.value", "subject.age_unit.id", "subject.age_event", "subject.age", "subject.ancestry_population", "subject.ethnicity", "subject.race", "subject.strain_name", "subject.linked_subjects", "subject.link_type", "subject.diagnosis.study_group_description", "subject.diagnosis.disease_diagnosis", "subject.diagnosis.disease_length", "subject.diagnosis.disease_stage", "subject.diagnosis.prior_therapies", "subject.diagnosis.immunogen", "subject.diagnosis.intervention", "subject.diagnosis.medical_history", "sample.sample_id", "sample.sample_type", "sample.tissue", "sample.anatomic_site", "sample.disease_state_sample", "sample.collection_time_point_relative", "sample.collection_time_point_reference", "sample.biomaterial_provider", "sample.tissue_processing", "sample.cell_subset.value", "sample.cell_subset.id", "sample.cell_phenotype", "sample.cell_species.value", "sample.cell_species.id", "sample.single_cell", "sample.cell_number", "sample.cells_per_reaction", "sample.cell_storage", "sample.cell_quality", "sample.cell_isolation", "sample.cell_processing_protocol", "sample.template_class", "sample.template_quality", "sample.template_amount", "sample.library_generation_method", "sample.library_generation_protocol", "sample.library_generation_kit_version", "sample.pcr_target.pcr_target_locus", "sample.pcr_target.forward_pcr_primer_target_location", "sample.pcr_target.reverse_pcr_primer_target_location", "sample.complete_sequences", "sample.physical_linkage", "sample.sequencing_run_id", "sample.total_reads_passing_qc_filter", "sample.sequencing_platform", "sample.sequencing_facility", "sample.sequencing_run_date", "sample.sequencing_kit", "sample.sequencing_files.file_type", "sample.sequencing_files.filename", "sample.sequencing_files.read_direction", "sample.sequencing_files.read_length", "sample.sequencing_files.paired_filename", "sample.sequencing_files.paired_read_direction", "sample.sequencing_files.paired_read_length", "data_processing.data_processing_id", "data_processing.primary_annotation", "data_processing.software_versions", "data_processing.paired_reads_assembly", "data_processing.quality_thresholds", "data_processing.primer_match_cutoffs", "data_processing.collapsing_method", "data_processing.data_processing_protocols", "data_processing.data_processing_files", "data_processing.germline_database", "data_processing.analysis_provenance_id"];

const REARRANGEMENT_FIELDS = ["sequence_id", "sequence", "sequence_aa", "rev_comp", "productive", "vj_in_frame", "stop_codon", "complete_vdj", "locus", "v_call", "d_call", "d2_call", "j_call", "c_call", "sequence_alignment", "sequence_alignment_aa", "germline_alignment", "germline_alignment_aa", "junction", "junction_aa", "np1", "np1_aa", "np2", "np2_aa", "np3", "np3_aa", "cdr1", "cdr1_aa", "cdr2", "cdr2_aa", "cdr3", "cdr3_aa", "fwr1", "fwr1_aa", "fwr2", "fwr2_aa", "fwr3", "fwr3_aa", "fwr4", "fwr4_aa", "v_score", "v_identity", "v_support", "v_cigar", "d_score", "d_identity", "d_support", "d_cigar", "d2_score", "d2_identity", "d2_support", "d2_cigar", "j_score", "j_identity", "j_support", "j_cigar", "c_score", "c_identity", "c_support", "c_cigar", "v_sequence_start", "v_sequence_end", "v_germline_start", "v_germline_end", "v_alignment_start", "v_alignment_end", "d_sequence_start", "d_sequence_end", "d_germline_start", "d_germline_end", "d_alignment_start", "d_alignment_end", "d2_sequence_start", "d2_sequence_end", "d2_germline_start", "d2_germline_end", "d2_alignment_start", "d2_alignment_end", "j_sequence_start", "j_sequence_end", "j_germline_start", "j_germline_end", "j_alignment_start", "j_alignment_end", "cdr1_start", "cdr1_end", "cdr2_start", "cdr2_end", "cdr3_start", "cdr3_end", "fwr1_start", "fwr1_end", "fwr2_start", "fwr2_end", "fwr3_start", "fwr3_end", "fwr4_start", "fwr4_end", "v_sequence_alignment", "v_sequence_alignment_aa", "d_sequence_alignment", "d_sequence_alignment_aa", "d2_sequence_alignment", "d2_sequence_alignment_aa", "j_sequence_alignment", "j_sequence_alignment_aa", "c_sequence_alignment", "c_sequence_alignment_aa", "v_germline_alignment", "v_germline_alignment_aa", "d_germline_alignment", "d_germline_alignment_aa", "d2_germline_alignment", "d2_germline_alignment_aa", "j_germline_alignment", "j_germline_alignment_aa", "c_germline_alignment", "c_germline_alignment_aa", "junction_length", "junction_aa_length", "np1_length", "np2_length", "np3_length", "n1_length", "n2_length", "n3_length", "p3v_length", "p5d_length", "p3d_length", "p5d2_length", "p3d2_length", "p5j_length", "consensus_count", "duplicate_count", "cell_id", "clone_id", "rearrangement_id", "repertoire_id", "sample_processing_id", "data_processing_id", "germline_database"];

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      repertoirePublic: [],
      rearrangementPublic: []
    }

    this.saveTokens = this.saveTokens.bind(this);
    this.isLoggedIn = this.isLoggedIn.bind(this);
    this.loginMsg = this.loginMsg.bind(this);
  }

  async componentDidMount() {  
    const json = await catchHttpErrors(async () => await getJson("/airr/v1/public_fields"));
    
    const fields = {
      "Repertoire": [],
      "Rearrangement": [],
      ... json
    };

    this.setState({... this.state, repertoirePublic: fields['Repertoire'], rearrangementPublic: fields['Rearrangement']});
  }

  repertoriePublic() {
    return this.state.publicFields['Repertoire'];
  }

  saveTokens(tokens) {
    if (tokens.token !== undefined) {
      this.setState({ ...this.state, token: tokens.token });
    }
  }

  isLoggedIn() {
    return this.state.token !== "";
  }

  loginMsg() {
    if (! this.isLoggedIn()) {
      return (
      <span>
        <i class="fas fa-circle mr-1" style={{color: 'red'}}></i>
      </span>
      );
    }

    return (
      <span>
        <i class="fas fa-circle mr-1" style={{color: 'green'}}></i>
      </span>
    );
  }

  render() {
    

    return (
      <KeycloakProvider 
        onTokens={this.saveTokens} keycloak={keycloak}
        onAuthSuccess={()=>toast("Logged in")}
        onAuthError={()=>toast("Login error")}
      >
        <div className="App">
          {/* HEADER */}
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">ADC Middleware Frontend</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
            </div>

            {this.loginMsg()}
            {
              this.isLoggedIn() ? 
                (<button class="btn btn-primary ml-2" onClick={() => this.setState({ ...this.state, token: "" })}> Logout </button>) :
                (<button class="btn btn-primary ml-2" onClick={() => keycloak.login()}> Login </button>)
            }
          </nav>
    
          {/* BODY */}
          <div class="container mt-5">
            <PublicEndpoint url="/info" title="(Unprotected) public endpoint"/>

            <GetEndpoint url="/repertoire" token={this.state.token} responseField="Repertoire" title="Request single repertoire"/>
            <GetEndpoint url="/rearrangement" token={this.state.token} responseField="Rearrangement" title="Request single rearrangement"/>

            <PostEndpoint 
              url="/repertoire" 
              token={this.state.token} 
              responseField="Repertoire" 
              publicFields={this.state.repertoirePublic}
              fields={REPERTOIRE_FIELDS}
              title="Search repertoires"
            />
            <PostEndpoint 
              url="/rearrangement" 
              token={this.state.token} 
              responseField="Rearrangement" 
              publicFields={this.state.rearrangementPublic}
              fields={REARRANGEMENT_FIELDS}
              title="Search rearrangements"
            />
          </div>

          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            />
        </div>

        
      </KeycloakProvider>
    );
  }
  
};

