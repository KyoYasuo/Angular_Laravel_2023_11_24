import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatSliderModule, MatExpansionModule, MatFormFieldModule, MatTableModule, MatPaginatorModule, MatMenuModule } from '@angular/material';
import { MatBasicAudioPlayerComponent } from './component/mat-basic-audio-player/mat-basic-audio-player.component';
import { AudioPlayerService } from './service/audio-player-service/audio-player.service';
import { CommonModule } from '@angular/common';
import { SecondsToMinutesPipe } from './pipe/seconds-to-minutes';
import { MatAdvancedAudioPlayerComponent } from './component/mat-advanced-audio-player/mat-advanced-audio-player.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faPlay, faPause, faSpinner, faStepForward, faStepBackward, faVolumeMute, faVolumeUp,faBackward,faForward
} from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { Ng5SliderModule } from 'ng5-slider';
import { TooltipModule } from 'ng2-tooltip-directive';
import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';
import {SuiModule} from 'ng2-semantic-ui';
@NgModule({
  exports: [
    MatButtonModule, MatCardModule, MatTableModule, MatFormFieldModule, 
    MatSliderModule, MatExpansionModule, MatPaginatorModule
  ]
})
export class MaterialModule {}

@NgModule({
  declarations: [MatBasicAudioPlayerComponent, SecondsToMinutesPipe, MatAdvancedAudioPlayerComponent],
  imports: [CommonModule, FormsModule, FontAwesomeModule, MaterialModule,Ng5SliderModule,TooltipModule,NgxBootstrapSliderModule,SuiModule],
  exports: [MatBasicAudioPlayerComponent, MatAdvancedAudioPlayerComponent],
  providers: [AudioPlayerService]
})
export class NgxAudioPlayerModule {
  constructor() {
    library.add(faPlay, faPause, faSpinner, faStepForward, faStepBackward, faVolumeMute, faVolumeUp,faBackward,faForward);
  }
}